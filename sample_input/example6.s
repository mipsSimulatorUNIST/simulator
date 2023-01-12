	.data
sum:	.word	0x1000000
data1:	.word	0x10
data2:	.word	0x100
iter:	.word	0x1
	.text
main:
	addiu	$29, $29, -8
	sw	$30, 4($29)
	addu	$30, $29, $0
	j	loop1
loop3:
	la	$2, sum
	slti	$2, $2, 3
	bne	$2, $0, loop2
	la	$2, sum
	srl	$3, $2, 1
	sw	$2, 0($2)
loop2:
	la	$2, iter
	addiu	$3, $2, 1
	sw	$3, 0($2)
loop1:
	la	$2, iter
	addi	$28, $0, 10
	slt	$2, $2, $28
	bne	$2, $0, loop3
	addu	$2, $2, $0
	move	$29, $30
	lw	$30, 4($29)
	addiu	$29, $29, 8